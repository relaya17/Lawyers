export interface Course {
    id: string
    title: string
    description: string
    lessons: Lesson[]
}

export interface Lesson {
    id: string
    title: string
    content: string
    duration: number
}

export interface LearningState {
    courses: Course[]
    lessons: Lesson[]
    progress: Record<string, number>
    loading: boolean
    error: string | null
}
