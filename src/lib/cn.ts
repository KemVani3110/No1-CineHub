/* eslint-disable @typescript-eslint/no-unused-vars */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

export function cnBase(baseClasses: string, ...conditionalClasses: ClassValue[]): string {
    return twMerge(clsx(baseClasses, ...conditionalClasses))
}


export function cnIf(
    condition: boolean,
    className: string,
    fallbackClassName?: string
): string {
    return condition ? className : (fallbackClassName || '')
}


export function cnVariants<T extends Record<string, Record<string, string>>>(
    variants: T,
    props: { [K in keyof T]?: keyof T[K] }
): string {
    const classes: string[] = []

    Object.entries(props).forEach(([key, value]) => {
        if (value && variants[key] && variants[key][value as string]) {
            classes.push(variants[key][value as string])
        }
    })

    return twMerge(clsx(classes))
}


export function cnResponsive(classes: {
    base?: string
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
}): string {
    const responsiveClasses: string[] = []

    if (classes.base) responsiveClasses.push(classes.base)
    if (classes.xs) responsiveClasses.push(`xs:${classes.xs}`)
    if (classes.sm) responsiveClasses.push(`sm:${classes.sm}`)
    if (classes.md) responsiveClasses.push(`md:${classes.md}`)
    if (classes.lg) responsiveClasses.push(`lg:${classes.lg}`)
    if (classes.xl) responsiveClasses.push(`xl:${classes.xl}`)
    if (classes['2xl']) responsiveClasses.push(`2xl:${classes['2xl']}`)

    return twMerge(clsx(responsiveClasses))
}


export function cnState(
    baseClasses: string,
    states: {
        hover?: string
        focus?: string
        active?: string
        disabled?: string
        visited?: string
        checked?: string
        indeterminate?: string
        invalid?: string
        required?: string
        readonly?: string
    }
): string {
    const stateClasses: string[] = [baseClasses]

    Object.entries(states).forEach(([state, className]) => {
        if (className) {
            stateClasses.push(className)
        }
    })

    return twMerge(clsx(stateClasses))
}


export function cnAnimation(
    baseClasses: string,
    animations: {
        enter?: string
        enterActive?: string
        exit?: string
        exitActive?: string
        transition?: string
    }
): string {
    const animationClasses: string[] = [baseClasses]

    Object.values(animations).forEach(className => {
        if (className) {
            animationClasses.push(className)
        }
    })

    return twMerge(clsx(animationClasses))
}


export function cnTheme(
    lightClasses: string,
    darkClasses: string,
    isDark: boolean = false
): string {
    return isDark ? darkClasses : lightClasses
}


export function cnExclude(classes: string, excludeClasses: string[]): string {
    const classArray = classes.split(' ')
    const filteredClasses = classArray.filter(className =>
        !excludeClasses.some(exclude => className.includes(exclude))
    )
    return twMerge(clsx(filteredClasses))
}


export function cnDebug(...classes: ClassValue[]): string {
    const result = twMerge(clsx(classes))
    console.log('ClassName Debug:', {
        input: classes,
        output: result,
        classes: result.split(' ')
    })
    return result
}

export default cn