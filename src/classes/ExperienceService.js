let experienceInstance = null

export function setExperience(instance) {
    experienceInstance = instance
}

export function getExperience() {
    return experienceInstance
}

export function clearExperience(instance) {
    if (experienceInstance === instance) experienceInstance = null
}
