import chapterOne from "./chapterOne";
import chapterTwo from "./chapterTwo";

const chapters = [chapterOne, chapterTwo];

const chapterById = Object.fromEntries(
  chapters.map((chapter) => [chapter.id, chapter]),
);

export { chapterById, chapters };
export default chapters;
