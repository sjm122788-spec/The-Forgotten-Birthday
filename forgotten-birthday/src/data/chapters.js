import chapterOne from "./chapterOne";
import chapterTwo from "./chapterTwo";
import chapterThree from "./chapterThree";
import chapterFour from "./chapterFour";
import chapterFive from "./chapterFive";
import chapterSix from "./chapterSix";
import chapterSeven from "./chapterSeven";
import chapterEight from "./chapterEight";
import chapterNine from "./chapterNine";
import chapterTen from "./chapterTen";
import chapterEleven from "./chapterEleven";

const chapters = [
  chapterOne,
  chapterTwo,
  chapterThree,
  chapterFour,
  chapterFive,
  chapterSix,
  chapterSeven,
  chapterEight,
  chapterNine,
  chapterTen,
  chapterEleven,
];

const chapterById =
  Object.fromEntries(
    chapters.map(
      (chapter) => [
        chapter.id,
        chapter,
      ],
    ),
  );

export {
  chapterById,
  chapters,
};

export default chapters;
