import { useLiveQuery } from "dexie-react-hooks";
import { omit } from "es-toolkit/compat";
import saveAs from "file-saver";
import { toast } from "sonner";

import { CharacterBookTable, db } from "@/db/schema";

export async function addCharacterBook(name: string) {
  try {
    const rows = await db.characterBook.add({
      name: name || "ooc.moe",
      description: "",
      scan_depth: 0,
      token_budget: 0,
      recursive_scanning: false,
      extensions: {},
      entries: [],
    });
    return rows;
  } catch (e) {
    throw e;
  }
}

export function getAllCharacterBookLists() {
  const rows = useLiveQuery(() =>
    db.characterBook.toArray().then((row) =>
      row.map(({ id, name }) => ({
        id,
        name,
      }))
    )
  );
  return rows;
}

export async function getCharacterBook(id: number) {
  try {
    const rows = db.characterBook.get(id).then((row) => {
      if (row) {
        return row;
      }
    });
    return rows;
  } catch (e) {
    throw e;
  }
}

export async function getCharacterBookEntries(bid: number, eid: number) {
  try {
    const rows = await db.characterBook.get(bid).then((item) => {
      if (item) {
        const lists = item.entries;
        const entry = lists.find((list) => list.id === eid);
        return entry;
      }
    });
    if (rows) {
      return rows;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateCharacterBookEntriesEnable(
  entryId: number,
  bookId: number
) {
  try {
    const entrys = await getCharacterBook(bookId);
    if (!entrys || !entrys.entries) {
      console.log("Entries not found");
      return;
    }
    const index = entrys.entries.findIndex((entry) => entry.id === entryId);
    if (index === -1) {
      console.log("Entry not found");
      return;
    }
    entrys.entries[index].enabled = !entrys.entries[index].enabled;
    await db.characterBook.update(bookId, { entries: entrys.entries });
    console.log("Entry updated successfully");
  } catch (e) {
    console.error("Error updating entry:", e);
    throw e;
  }
}

export async function deleteCharacterBook(id: number) {
  try {
    const rows = await db.characterBook.delete(id);
  } catch (e) {
    throw e;
  }
}

export async function deleteCharacterBookEntries(id: number, index: number) {
  try {
    const entries = await db.characterBook.get(id).then((item) => {
      return item?.entries;
    });
    if (entries) {
      const newEntrie = entries.filter((_, i) => i !== index);
      const rows = await db.characterBook.update(id, { entries: newEntrie });
      return rows;
    }
  } catch (e) {
    throw e;
  }
}

export async function addCharacterBookEntries(id: number) {
  try {
    const entries = await db.characterBook.get(id).then((item) => {
      return item?.entries;
    });
    if (entries) {
      const defaultEntries = {
        keys: [],
        content: "",
        extensions: {},
        enabled: false,
        insertion_order: 0,
        case_sensitive: false,
        name: "",
        priority: 0,
        id: undefined,
        comment: "",
        selective: false,
        secondary_keys: [],
        constant: false,
        position: "",
      };
      const newEntrie = [...entries, defaultEntries];
      const rows = await db.characterBook.update(id, { entries: newEntrie });
      return rows;
    }
  } catch (e) {
    throw e;
  }
}

export async function exportWorldBook(id: number) {
  try {
    const rows: CharacterBookTable | undefined = await db.characterBook.get(id);
    if (!rows) return;

    const formattedData = {
      entries: Object.fromEntries(
        rows.entries.map((entry, index) => [
          String(index),
          {
            uid: entry.id ?? index,
            key: entry.keys || [],
            keysecondary: entry.secondary_keys || [],
            comment: entry.comment || "",
            content: entry.content || "",
            constant: entry.constant ?? false,
            vectorized: false,
            selective: entry.selective ?? true,
            selectiveLogic: 0,
            addMemo: true,
            order: entry.priority ?? 100,
            position: 0,
            disable: !entry.enabled,
            excludeRecursion: false,
            preventRecursion: false,
            delayUntilRecursion: false,
            probability: 100,
            useProbability: true,
            depth: rows.scan_depth ?? 4,
            group: "",
            groupOverride: false,
            groupWeight: 100,
            scanDepth: rows.scan_depth ?? null,
            caseSensitive: entry.case_sensitive ?? null,
            matchWholeWords: null,
            useGroupScoring: null,
            automationId: "",
            role: null,
            sticky: 0,
            cooldown: 0,
            delay: 0,
            displayIndex: index,
          },
        ])
      ),
    };

    const jsonString = JSON.stringify(formattedData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const fileName = rows.name ? `${rows.name}.json` : "worldbook.json";

    saveAs(blob, fileName);
  } catch (e) {
    console.error(e);
  }
}

export async function importCharacterBook() {
  try {
    const handleSelectFile = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (event: any) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("application/json")) {
          console.warn("Invalid file");
          return;
        }
        const fileContent = await file.text();
        let parsedData;
        try {
          parsedData = JSON.parse(fileContent);
        } catch (error) {
          console.error("Invalid JSON format");
          return;
        }
        const characterBook: Omit<CharacterBookTable, "id"> = {
          name: file.name.replace(".json", ""),
          description: "",
          scan_depth: parsedData.entries?.[0]?.depth ?? 4,
          token_budget: undefined,
          recursive_scanning: undefined,
          extensions: {},
          entries: Object.values(parsedData.entries || {}).map(
            (entry: any, index) => ({
              keys: entry.key || [],
              content: entry.content || "",
              extensions: {},
              enabled: !entry.disable,
              insertion_order: entry.order ?? 100,
              case_sensitive: entry.caseSensitive ?? undefined,
              name: undefined,
              priority: entry.order ?? 100,
              id: undefined,
              comment: entry.comment || "",
              selective: entry.selective ?? true,
              secondary_keys: entry.keysecondary || [],
              constant: entry.constant ?? false,
              position: "after_char",
            })
          ),
        };
        db.characterBook.add(characterBook);
        toast.success("OK");
      };
      input.click();
    };

    handleSelectFile();
  } catch (e) {
    console.log("Import failed:", e);
  }
}

export async function copyWorldBook(id: number) {
  try {
    const rows = await db.characterBook.get(id);
    if (!rows) return;
    const book = omit(rows, ["id"]);
    db.characterBook.add(book);
    toast.success("OK");
  } catch (e) {
    console.log(e);
  }
}
