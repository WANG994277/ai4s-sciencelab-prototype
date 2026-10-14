import {useLocation,useNavigate,useParams as params} from 'react-router-dom';
export function useSearchParams(){return new URLSearchParams(useLocation().search)}
export function usePathname(){return useLocation().pathname.replace(/^.*\/resource/,'')||'/'}
export function useParams<T extends Record<string,string|string[]>>(){return params() as Partial<T>}
export function useRouter(){const navigate=useNavigate();const resolve=(url:string)=>url.startsWith('/')?'/resource'+url:url;return {push:(url:string)=>navigate(resolve(url)),replace:(url:string)=>navigate(resolve(url),{replace:true}),back:()=>navigate(-1),refresh:()=>location.reload(),prefetch:()=>Promise.resolve()}}
