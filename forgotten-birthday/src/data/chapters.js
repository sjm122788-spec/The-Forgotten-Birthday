import chapterOne from "./chapterOne";
import chapterTwo from "./chapterTwo";
import chapterThree from "./chapterThree";

const chapters = [
  chapterOne,
  chapterTwo,
  chapterThree,
];

const chapterById = Object.fromEntries(
  chapters.map((chapter) => [
    chapter.id,
    chapter,
  ]),
);

export {
  chapterById,
  chapters,
};

export default chapters;
