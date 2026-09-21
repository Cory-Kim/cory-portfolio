import assert from 'node:assert/strict'
import test from 'node:test'

import { experienceEntries } from '../src/app/_data/experience.ts'
import { selectedProjects } from '../src/app/_data/projects.ts'
import { featuredSkills, supportingSkills } from '../src/app/_data/skills.ts'

test('featured projects contain complete, unique, secure links', () => {
  assert.ok(selectedProjects.length >= 3)
  assert.equal(new Set(selectedProjects.map((project) => project.name)).size, selectedProjects.length)

  for (const project of selectedProjects) {
    assert.ok(project.name && project.eyebrow && project.summary)
    assert.ok(project.stack.length > 0, `${project.name} needs a technology stack`)
    assert.equal(new URL(project.href).protocol, 'https:', `${project.name} must use HTTPS`)
  }
})

test('skill metadata is unique and uses valid display colors', () => {
  const names = [...featuredSkills.map((skill) => skill.name), ...supportingSkills]
  assert.equal(new Set(names).size, names.length)

  for (const skill of featuredSkills) {
    assert.match(skill.color, /^#[0-9a-f]{6}$/i, `${skill.name} has an invalid color`)
    assert.ok(skill.short.length >= 1 && skill.short.length <= 3)
  }
})

test('experience entries have the content required by the resume views', () => {
  assert.ok(experienceEntries.length > 0)
  for (const entry of experienceEntries) {
    assert.ok(entry.period && entry.role && entry.organization && entry.type && entry.summary)
    assert.ok(entry.highlights.length >= 2, `${entry.role} needs at least two highlights`)
    assert.ok(entry.highlights.every((highlight) => highlight.trim().length > 10))
  }
})
