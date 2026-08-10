import {protectAdmin} from '@/lib/admin-page';import {getCategories} from '@/lib/db';import AppForm from '@/components/AppForm';
export default async function Page(){await protectAdmin();const cats=await getCategories();return <><div className="admin-top"><div><h1>Add New App</h1><p>Complete the app data, content, SEO and schema.</p></div></div><AppForm categories={cats}/></>}
