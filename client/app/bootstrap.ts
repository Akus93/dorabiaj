import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AppCmp} from './components/app/app';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';

import {BrowserXhr, HTTP_PROVIDERS} from 'angular2/http';
import {Injectable} from 'angular2/core';

@Injectable()
class CORSBrowserXHR extends BrowserXhr {
    build(): any {
        var xhr:any = super.build();
        xhr.withCredentials = true;
        return xhr;
    }
}

bootstrap(AppCmp, [
  ROUTER_PROVIDERS, MATERIAL_PROVIDERS, HTTP_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provide(BrowserXhr, {useClass: CORSBrowserXHR})
]);
