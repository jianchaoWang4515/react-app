import Home from '@/router/home';
import Host from '@/router/host';
import Server from '@/router/server';
import Error from '@/router/error';

let routes = [
    ...Home,
    ...Host,
    ...Server,
    ...Error
]

export default routes;
