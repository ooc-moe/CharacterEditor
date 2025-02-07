import { useLiveQuery } from 'dexie-react-hooks';
import { remove } from 'es-toolkit';
import { toast } from 'sonner';
import { v7 as uuidv7 } from 'uuid';

import { db } from '@/db/schema';

export async function newGallery(name:string){
  try{
    await db.gallery.add({
      uuid:uuidv7(),
      name:name,
      content:[]
    })
    return "!OK"
  }catch(e){
    console.log(e)
    return "!ERROR"
  }
}

export async function deleteGallery(id: number) {
  try {
    await db.gallery.delete(id);
    return "!OK"
  } catch (e) {
    console.log(e)
    return "!ERROR"
  }
}

export function getGally(){
  const rows = useLiveQuery(() =>
    db.gallery.toArray().then((row) =>
      row.map(({ id, uuid, name,}) => ({
        id,
        uuid,
        name,
      }))
    )
  );
  return rows;
}

export function getGallyList(id:number){
  const rows = useLiveQuery(() =>
    db.gallery.get(id)
  );
  return rows;
}

export async function addGalleryItem(id:number,name:string,value:string) {
  try{
    const list = await db.gallery.get(id)
    if(!list) {
      toast.error("Gallery Not Found")
      return
    }
    const entried = list.content
    const newEntry = {
      uuid:uuidv7(),
      name:name,
      url:value,
    }
    const entry = [...entried,newEntry]
    await db.gallery.update(id,{
      "content":entry
    })
  }catch(e){
    console.log(e)
  }
}

export async function deleteGalleryItem(id:number,uuid:string) {
  try{
    const deleteUUID = uuid
    const entried = await db.gallery.get(id).then((item)=>{
      if(!item) return
      return item.content
    })
    if(!entried) return
    remove(entried,item => item.uuid == deleteUUID)
    await db.gallery.update(id,{
      "content":entried
    })
  }catch(e){
    console.log(e)
  }
}