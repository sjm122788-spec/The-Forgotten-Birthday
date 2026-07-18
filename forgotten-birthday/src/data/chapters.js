import chapterOne from "./chapterOne";
import chapterTwo from "./chapterTwo";
import chapterThree from "./chapterThree";
import chapterFour from "./chapterFour";
import chapterFive from "./chapterFive";
import chapterSix from "./chapterSix";

const chapters = [
  chapterOne,
  chapterTwo,
  chapterThree,
  chapterFour,
  chapterFive,
  chapterSix,
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
