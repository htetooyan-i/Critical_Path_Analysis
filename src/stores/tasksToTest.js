const tasks = ref([
  {
    activity: "A",
    depends: [],
    duration: 3,
  },
  {
    activity: "B",
    depends: [],
    duration: 4,
  },
  {
    activity: "C",
    depends: [],
    duration: 6,
  },
  {
    activity: "D",
    depends: ["B"],
    duration: 3,
  },
  {
    activity: "E",
    depends: ["A"],
    duration: 9,
  },
  {
    activity: "F",
    depends: ["A"],
    duration: 1,
  },
  {
    activity: "G",
    depends: ["B"],
    duration: 4,
  },
  {
    activity: "H",
    depends: ["C", "D"],
    duration: 5,
  },
  {
    activity: "I",
    depends: ["C", "D"],
    duration: 4,
  },
  {
    activity: "J",
    depends: ["E"],
    duration: 3,
  },
  {
    activity: "K",
    depends: ["F", "G", "H"],
    duration: 6,
  },
  {
    activity: "L",
    depends: ["F", "G", "H"],
    duration: 3,
  },
  {
    activity: "M",
    depends: ["I"],
    duration: 6,
  },
  {
    activity: "N",
    depends: ["J", "K"],
    duration: 9,
  },
]);
