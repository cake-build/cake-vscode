public class BuildVersion
{
    public string Version { get; private set; }
    public string SemVersion { get; private set; }
    public string Milestone { get; private set; }
    public string CakeVersion { get; private set; }

    public static BuildVersion CalculatingSemanticVersion(
        ICakeContext context,
        BuildParameters parameters
        )
    {
        if (context == null)
        {
            throw new ArgumentNullException("context");
        }

        string version = null;
        string semVersion = null;
        string milestone = null;

        if (!parameters.SkipGitVersion)
        {
            context.Information("Calculating Semantic Version");
            if (!parameters.IsLocalBuild || parameters.IsPublishBuild || parameters.IsReleaseBuild)
            {
                context.GitVersion(new GitVersionSettings{
                    OutputType = GitVersionOutput.BuildServer
                });

                version = context.EnvironmentVariable("GitVersion_MajorMinorPatch");
                semVersion = context.EnvironmentVariable("GitVersion_LegacySemVerPadded");
                milestone = string.Concat("v", version);
            }

            GitVersion assertedVersions = context.GitVersion(new GitVersionSettings
            {
                OutputType = GitVersionOutput.Json,
            });

            version = assertedVersions.MajorMinorPatch;
            semVersion = assertedVersions.LegacySemVerPadded;
            milestone = string.Concat("v", version);

            context.Information("Calculated Semantic Version: {0}", semVersion);
        }

        if (string.IsNullOrEmpty(version) || string.IsNullOrEmpty(semVersion))
        {
            context.Information("Hardcoding version number, as GitVersion didn't execute...");
            version = "0.1.0";
            semVersion = "0.1.0";
            milestone = string.Concat("v", version);
        }

        var cakeVersion = typeof(ICakeContext).Assembly.GetName().Version.ToString();

        return new BuildVersion
        {
            Version = version,
            SemVersion = semVersion,
            Milestone = milestone,
            CakeVersion = cakeVersion
        };
    }
}
