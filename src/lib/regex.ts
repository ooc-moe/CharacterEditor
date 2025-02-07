import { db, RegexScriptsTable } from "@/db/schema";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const regexScriptsTableSchema = z.object({
  id: z.string(),
  scriptName: z.string(),
  findRegex: z.string(),
  replaceString: z.string(),
  trimStrings: z.array(z.string()),
  placement: z.array(z.number()),
  disabled: z.boolean(),
  markdownOnly: z.boolean(),
  promptOnly: z.boolean(),
  runOnEdit: z.boolean(),
  substituteRegex: z.boolean(),
  minDepth: z.union([z.number(), z.null()]),
  maxDepth: z.union([z.number(), z.null()]),
});

export function getAllRegexScriptLists() {
  const rows = useLiveQuery(() =>
    db.regexScripts.toArray().then((row) =>
      row.map(({ id, uuid, scriptName }) => ({
        id,
        uuid,
        scriptName,
      }))
    )
  );
  return rows;
}


export function getRegexScript(id:number){
  try{
    const rows = db.regexScripts.get(id).then((row)=>{
      if(row){
        return row
      }
    })
    return rows
  }catch(e){
    throw e
  }
}

export async function addRegexScript(scriptName: string) {
  const rows = await db.regexScripts.add({
    uuid: uuidv4(),
    scriptName: scriptName,
    findRegex: "",
    replaceString: "",
    trimStrings: [],
    placement: [],
    disabled: false,
    markdownOnly: false,
    promptOnly: false,
    runOnEdit: false,
    substituteRegex: false,
    minDepth: 0,
    maxDepth: 0,
  });
}

export async function deleteRegexxScript(id: number) {
  const rows = await db.regexScripts.delete(id);
}

export async function importRegex() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const fileContent = await file.text();
      const json = JSON.parse(fileContent);
      const result = await regexScriptsTableSchema.safeParse(json);
      if (!result.success) {
        console.log("error file type");
        return;
      }
      const { id, ...rest } = result.data;
      const regex = {
        ...rest,
        uuid: id,
      };
      await db.regexScripts.add(regex);
      toast.success("Add Regex:" + regex.scriptName)
    } catch (e) {
      throw e;
    }
  };
  input.click();
}

export async function updateScript_Name(id:number,value:string) {
  try{
    const rows = await db.regexScripts.update(id,{"scriptName":value})
    if(!rows) return "!ERROR"
    console.log(rows)
  }catch(e){
    console.log(e)
    return
  }
}

export async function updateFind_Regex(id:number,value:string) {
  try{
    const rows = await db.regexScripts.update(id,{"findRegex":value})
    if(!rows) return "!ERROR"
    console.log(rows)
  }catch(e){
    console.log(e)
    return
  }
}

export async function updateReplaceString(id:number,value:string) {
  try{
    const rows = await db.regexScripts.update(id,{"replaceString":value})
    if(!rows) return "!ERROR"
    console.log(rows)
  }catch(e){
    console.log(e)
    return
  }
}

export async function updateIsEnable(id: number) {
  try {
    const currentItem = await db.regexScripts.get(id);
    if (!currentItem) {
      return "!ERROR: Item not found";
    }
    const currentDisabled = currentItem.disabled;

    const newDisabled = !currentDisabled;

    const rows = await db.regexScripts.update(id, { disabled: newDisabled });

    if (!rows) return "!ERROR: Update failed"; 

    console.log("Update successful, new disabled value:", newDisabled);
    return newDisabled; 
  } catch (e) {
    console.error("Error updating disabled value:", e);
    return "!ERROR: "
  }
}