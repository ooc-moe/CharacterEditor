import { z } from 'zod';

export const runtime = 'edge';
const formDataSchema = z.object({
  name: z.string(),
  file: z.instanceof(File),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    if (!formData) return new Response("!ERROR")

    const name = formData.get("name");
    const file = formData.get("file");

    if (!name || !file) {
      return new Response("!ERROR")
    }

    const result = await formDataSchema.safeParseAsync({ name, file });
    if (!result.success) {
      return new Response("!ERROR")
    }

    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", file);

    const catbox = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxForm,
    });

    if (!catbox.ok) {
      return new Response("!ERROR")
    }

    const catboxUrl = await catbox.text(); 

    if (!catboxUrl) {
      return new Response("!ERROR")
    }
    const res ={
      name:name,
      url:catboxUrl
    }
    return new Response(JSON.stringify(res))
    
  } catch (e) {
    console.error(e);
    return new Response("!ERROR")
  }
}
