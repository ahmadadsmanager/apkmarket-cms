import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import {cookieName,verifySession} from './auth';
export async function protectAdmin(){const store=await cookies();if(!verifySession(store.get(cookieName())?.value))redirect('/admin/login')}
