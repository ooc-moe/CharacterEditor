import Dexie, { type EntityTable } from "dexie";

interface CharacterTable {
  id: number
  cover:string 
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  spec: string;
  spec_version: string;
  data: {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    first_mes: string;
    mes_example: string;
    creator_notes: string;
    system_prompt: string;
    post_history_instructions: string;
    alternate_greetings: Array<string>;
    tags: Array<string>;
    creator: string;
    character_version: string;
    extensions: Record<string, any>;
  };
}

interface CharacterBookTable {
  id: number;
  name: string;
  description?: string;
  scan_depth?: number;
  token_budget?: number;
  recursive_scanning?: boolean;
  extensions: Record<string, any>;
  entries: Array<{
    keys: Array<string>;
    content: string;
    extensions: Record<string, any>;
    enabled: boolean;
    insertion_order: number;
    case_sensitive?: boolean;
    name?: string;
    priority?: number;
    id?: number;
    comment?: string;
    selective?: boolean;
    secondary_keys?: Array<string>;
    constant?: boolean;
    position?: string;
  }>;
}

interface RegexScriptsTable {
  id:number,
  uuid:string,
  scriptName:string,
  findRegex:string,
  replaceString:string,
  trimStrings:Array<string>
  placement:Array<number>
  disabled:boolean,
  markdownOnly:boolean,
  promptOnly:boolean,
  runOnEdit:boolean,
  substituteRegex:boolean,
  minDepth:number | null,
  maxDepth:number | null,
}

interface GalleryTable {
  id:number,
  uuid:string,
  name:string,
  content:Array<{
    uuid:string,
    name:string
    url:string
  }>
}

const db = new Dexie("OoC-CharacterEditor") as Dexie & {
  character: EntityTable<CharacterTable, "id">;
  characterBook: EntityTable<CharacterBookTable, "id">;
  regexScripts: EntityTable<RegexScriptsTable,"id">
  gallery: EntityTable<GalleryTable,"id">
};

db.version(1).stores({
  character:"++id",
  characterBook:"++id",
  regexScripts:"++id",
  gallery:"++id"
});

export type { CharacterTable, CharacterBookTable, RegexScriptsTable };
export { db };