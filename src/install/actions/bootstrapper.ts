import { installCakeBootstrapperFile } from '../../bootstrapper/cakeBootstrapperCommand';
import { CakeBootstrapper } from '../../bootstrapper/cakeBootstrapper';

export function installBootstrappers(): Promise<void[]> {
    var infos = CakeBootstrapper.getBootstrappers();
    return Promise.all(infos.map(i => installCakeBootstrapperFile(i, false)));
}
