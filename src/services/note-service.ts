/**
 * Represents a note with its category, original content, and summary.
 */
export interface Note {
  /**
   * The category of the note.
   */
  category: string;
  /**
   * The original content of the note.
   */
  originalNote: string;
  /**
   * A summary of the note.
   */
  summary: string;
}

/**
 * Asynchronously retrieves a list of notes, optionally filtered by category.
 * @param category Optional category to filter notes by.
 * @returns A promise that resolves to an array of Note objects.
 */
export async function getNotes(category?: string): Promise<Note[]> {
  // TODO: Implement this by calling an external API.
  const res = await fetch(process.env.BASE_URL + '/api/notes');
  return res.json() as Promise<Note[]>;

  // const stubbedNotes: Note[] = [
  //   {
  //     category: 'Meeting',
  //     originalNote: `# Hi, *Pluto*!.`,
  //     summary: `
  // # 盆底修复方法与注意事项
  // ## 一、修复方法
  // 1. **医疗修复**
  //    采用电刺激技术激活盆底肌群

  // 2. **凯格尔运动**
  //    ▫️肌肉定位方法：
  //    - 憋尿法：排尿时中断尿流感受盆底肌
  //    - 指检法：手指感知阴道-肛门肌群收缩

  //    ▫️训练步骤：
  //    ① 排空膀胱，深呼吸放松身体
  //    ② 呼气时由外向内、由下向上收紧会阴部肌群（尿道口至肛门区域）
  //    ③ 吸气时缓慢放松肌群

  // ## 二、注意事项
  // 1. 训练后放松：采用蛙式姿势5分钟配合深呼吸缓解肌肉疲劳
  // 2. 黄金修复期：产后6个月内修复效果最佳.
  //     `
  //   },
  //   {
  //     category: 'Research',
  //     originalNote: 'Explored new methodologies for data analysis.',
  //     summary: 'Data analysis methodologies exploration summary.'
  //   },
  //   {
  //     category: 'Personal',
  //     originalNote: 'Things to buy from the grocery store.',
  //     summary: 'List of grocery items.'
  //   }
  // ];

  // return stubbedNotes;
}
