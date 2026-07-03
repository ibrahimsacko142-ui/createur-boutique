#!/usr/bin/env python3
"""Clean up duplicate sections from page.tsx and improve parrainage."""

import re

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Helper: find line numbers of section markers
def find_section_lines(lines, marker):
    result = []
    for i, line in enumerate(lines):
        if marker in line:
            result.append(i)
    return result

# Get all section markers
print("=== SECTIONS FOUND ===")
for i, line in enumerate(lines):
    if '═══' in line and '<!--' in line:
        print(f"  Line {i+1}: {line.strip()}")

print(f"\nTotal lines: {len(lines)}")

# Define sections to REMOVE (by their exact opening comment markers)
# We'll remove from the comment line to the closing </section> tag

removals = [
    # 1. "Comment Commander" (duplicate of "Comment Ça Marche")
    '{/* ═══ COMMENT COMMANDER ═══ */}',
    # 2. "Pourquoi Nous Choisir" #1 (the old one at ~line 1097, without the guarantee)
    # We need to identify the FIRST occurrence
    # 3. "Avis Clients" (duplicate of "Témoignages Clients")
    '{/* ═══ AVIS CLIENTS ═══ */}',
    # 4. "Parrainage" #1 (the old one)
    # This is trickier - both have same marker, we remove the FIRST one
    # 5. "Paiement & Retrait" (duplicate of "Dépôt et Retrait")
    '{/* ═══ PAIEMENT & RETRAIT ═══ */}',
]

# Find exact line numbers for each section to remove
sections_to_remove = []

# 1. Comment Commander
idx = None
for i, line in enumerate(lines):
    if '{/* ═══ COMMENT COMMANDER ═══ */}' in line:
        idx = i
        break
if idx:
    sections_to_remove.append(('Comment Commander', idx))

# 2. First "Pourquoi Nous Choisir" (the old one without guarantee, around line 1097)
pnc_indices = []
for i, line in enumerate(lines):
    if '{/* ═══ POURQUOI NOUS CHOISIR ═══ */}' in line:
        pnc_indices.append(i)
if len(pnc_indices) >= 2:
    sections_to_remove.append(('Pourquoi Nous Choisir #1 (old)', pnc_indices[0]))
    print(f"  Found 2 'Pourquoi Nous Choisir' at lines {pnc_indices[0]+1} and {pnc_indices[1]+1}")

# 3. Avis Clients
idx = None
for i, line in enumerate(lines):
    if '{/* ═══ AVIS CLIENTS ═══ */}' in line:
        idx = i
        break
if idx:
    sections_to_remove.append(('Avis Clients', idx))

# 4. First "Parrainage" (the old one)
par_indices = []
for i, line in enumerate(lines):
    if '{/* ═══ PARRAINAGE ═══ */}' in line:
        par_indices.append(i)
if len(par_indices) >= 2:
    sections_to_remove.append(('Parrainage #1 (old)', par_indices[0]))
    print(f"  Found 2 'Parrainage' at lines {par_indices[0]+1} and {par_indices[1]+1}")

# 5. Paiement & Retrait
idx = None
for i, line in enumerate(lines):
    if '{/* ═══ PAIEMENT & RETRAIT ═══ */}' in line:
        idx = i
        break
if idx:
    sections_to_remove.append(('Paiement & Retrait', idx))

print(f"\n=== SECTIONS TO REMOVE ({len(sections_to_remove)}) ===")
for name, start in sections_to_remove:
    print(f"  {name}: starts at line {start+1}")

# Now find the end of each section (closing </section>)
# We need to handle nesting carefully
def find_closing_section(lines, start):
    """Find the line number of the closing </section> that matches the opening at start."""
    depth = 0
    for i in range(start, len(lines)):
        if '<section' in lines[i]:
            depth += 1
        if '</section>' in lines[i]:
            depth -= 1
            if depth == 0:
                return i
    return None

# Also find and remove the "Garantie de Qualité" card within Avant/Après section
# It's between "Garantie de qualité" comment and the closing FadeIn
garantie_start = None
for i, line in enumerate(lines):
    if 'Garantie de qualité' in line and 'Notre promesse' in line:
        # Go back to find the FadeIn wrapper
        for j in range(i, max(0, i-20), -1):
            if 'FadeIn delay={0.1}' in lines[j]:
                garantie_start = j
                break
        break

if garantie_start:
    # Find the end of this FadeIn block
    # Count opening/closing tags
    depth = 0
    started = False
    garantie_end = None
    for i in range(garantie_start, len(lines)):
        if '<FadeIn' in lines[i]:
            started = True
            depth += 1
        if '</FadeIn>' in lines[i]:
            depth -= 1
            if depth == 0 and started:
                garantie_end = i
                break
    if garantie_end:
        sections_to_remove.append(('Garantie card in Avant/Après', garantie_start))

# Sort by start line, descending (so we remove from bottom to top)
sections_to_remove.sort(key=lambda x: x[1], reverse=True)

print(f"\n=== REMOVING SECTIONS (bottom to top) ===")
remove_ranges = []
for name, start in sections_to_remove:
    end = find_closing_section(lines, start)
    if end is None:
        # For non-section blocks (like the garantie card)
        if 'Garantie' in name:
            end = garantie_end
        else:
            print(f"  WARNING: Could not find end for {name}")
            continue
    # Include trailing whitespace
    while end + 1 < len(lines) and lines[end + 1].strip() == '':
        end += 1
    remove_ranges.append((start, end))
    print(f"  {name}: lines {start+1}-{end+1} ({end-start+1} lines)")

# Remove sections
new_lines = lines[:]
for start, end in sorted(remove_ranges, reverse=True):
    del new_lines[start:end+1]

print(f"\nRemoved {len(lines) - len(new_lines)} lines")
print(f"New total: {len(new_lines)} lines")

with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.writelines(new_lines)

print("\nDone! File updated.")