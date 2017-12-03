export interface Config {
    Nuget: {
        Source?: string,
        UseInProcessClient?: boolean,
        LoadDependencies?: boolean
    },
    Paths: {
        Tools: string,
        Addins?: string,
        Modules?: string
    },
    Settings: {
        SkipVerification?: boolean
    }
}
