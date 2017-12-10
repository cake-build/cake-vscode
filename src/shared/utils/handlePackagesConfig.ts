import { parseString, Builder as XMLBuilder } from 'xml2js';
import { getFileErrorMessage, handleError } from '../../shared/utils';

export function createEmptyPackagesConfigAsXml() {
    return '<packages></packages>';
}

export function createPackageSection(
    packageId: string,
    packageVersion: string
): any {
    return {
        package: {
            $: {
                id: packageId,
                version: packageVersion
            }
        }
    };
}

export function updatePackagesConfig(
    xmlConfig: any,
    packageName: string,
    packageVersion: string
) {
    const version = packageVersion.startsWith('Latest version')
        ? '*'
        : packageVersion;
    let fixedPackages: Array<{}> = [];

    fixedPackages.push(createPackageSection(packageName, version));

    if (!xmlConfig.packages || !xmlConfig.packages.package) {
        return { packages: fixedPackages };
    }

    let refPackages = [...xmlConfig.packages.package];

    refPackages.forEach((ref: any) => {
        if (ref.$.id === packageName) return;
        fixedPackages.push(createPackageSection(ref.$.id, ref.$.version));
    });

    fixedPackages.sort((ref1: any, ref2: any) => {
        if (ref1.package.$.id > ref2.package.$.id) {
            return 1;
        }
        if (ref1.package.$.id < ref2.package.$.id) {
            return -1;
        }
        return 0;
    });

    return { packages: fixedPackages };
}

export function buildXmlFromContent(content: string): string {
    const xmlBuilder = new XMLBuilder({
        xmldec: {
            version: '1.0',
            encoding: 'utf-8'
        }
    });

    const xml = xmlBuilder.buildObject(content);
    return xml;
}

export function parseAndUpdatePackagesConfig({
    content,
    packageFilePath,
    selectedPackageName,
    selectedVersion
}: {
    content: string;
    packageFilePath: string;
    selectedPackageName: string;
    selectedVersion: string;
}): Promise<any | never> {
    return new Promise((resolve, reject) => {
        parseString(content, (err, packageConfig: any = {}) => {
            if (err) {
                return handleError(
                    err,
                    getFileErrorMessage('parse', packageFilePath),
                    reject
                );
            }

            let updatedPackages = packageConfig;
            let buildedContent = '';
            try {
                updatedPackages = updatePackagesConfig(
                    updatedPackages,
                    selectedPackageName,
                    selectedVersion
                );

                buildedContent = buildXmlFromContent(updatedPackages);
            } catch (ex) {
                return handleError(
                    ex,
                    getFileErrorMessage('update', packageFilePath),
                    reject
                );
            }

            return resolve({
                filePath: packageFilePath,
                content: buildedContent,
                message: selectedPackageName
            });
        });
    });
}