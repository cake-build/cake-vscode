import { installCakeBootstrapperFile } from '../../bootstrapper/cakeBootstrapperCommand';
import { CakeBootstrapper } from '../../bootstrapper/cakeBootstrapper';
import { enums } from '../../shared';

export function installBootstrappers(bootstrapperType: enums.RunnerType): Promise<void[]> {
    var infos = CakeBootstrapper.getBootstrappersByType(bootstrapperType);
    return Promise.all(infos.map(i => installCakeBootstrapperFile(i, false)));
}
