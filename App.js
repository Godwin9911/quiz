import { StatusBar } from "expo-status-bar";
import { isEmpty, shuffle } from "lodash";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  BackHandler,
  Alert,
} from "react-native";
import {
  ActivityIndicator,
  Provider as PaperProvider,
  Colors,
  Appbar,
  Headline,
  Button,
  Paragraph,
  RadioButton,
  Menu,
  DefaultTheme,
} from "react-native-paper";
import { decode } from "html-entities";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0C1E7F",
    accent: "#FF008E",
  },
};

function Home({ navigation, route }) {
  const category = [
    { value: 9, name: "General Knowledge" },
    { value: 10, name: "Books" },
    { value: 11, name: "Film" },
    { value: 12, name: "Music" },
    { value: 13, name: "Musicals & Theatres" },
    { value: 14, name: "Television" },
    { value: 15, name: "Video Games" },
    { value: 16, name: "Board Games" },
  ];
  return (
    <View style={styles.main}>
      <Headline
        style={{
          textAlign: "center",
          marginBottom: 24,
          marginTop: 8,
          fontWeight: "600",
        }}
      >
        Select Category
      </Headline>

      <View style={{}}>
        {category.map((el, index) => (
          <Button
            mode="contained"
            contentStyle={styles.categoryButton}
            style={{ marginBottom: 16 }}
            key={index}
            onPress={() =>
              navigation.navigate("Questions", { category: el.value })
            }
          >
            {el.name}
          </Button>
        ))}
      </View>
    </View>
  );
}

function Questions({ navigation, route }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    /*
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question:
        "This field is sometimes known as &ldquo;The Dismal Science.&rdquo;",
      correct_answer: "Economics",
      incorrect_answers: ["Philosophy", "Politics", "Physics"],
    },
    {
      category: "General Knowledge",
      type: "boolean",
      difficulty: "easy",
      question: "The Great Wall of China is visible from the moon.",
      correct_answer: "False",
      incorrect_answers: ["True"],
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "When was &quot;YouTube&quot; founded?",
      correct_answer: "February 14, 2005",
      incorrect_answers: [
        "May 22, 2004",
        "September 12, 2005",
        "July 19, 2009",
      ],
    },
    {
      category: "General Knowledge",
      type: "boolean",
      difficulty: "medium",
      question: "You are allowed to sell your soul on eBay.",
      correct_answer: "False",
      incorrect_answers: ["True"],
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question: "The term &quot;scientist&quot; was coined in which year?",
      correct_answer: "1833",
      incorrect_answers: ["1933", "1942", "1796"],
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "Where is Apple Inc. headquartered?",
      correct_answer: "Cupertino, California",
      incorrect_answers: [
        "Redwood City, California",
        "Redmond, Washington",
        "Santa Monica, CA",
      ],
    },
    {
      category: "General Knowledge",
      type: "boolean",
      difficulty: "medium",
      question:
        "&quot;Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo.&quot; is a grammatically correct sentence.",
      correct_answer: "True",
      incorrect_answers: ["False"],
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "The word &quot;astasia&quot; means which of the following?",
      correct_answer: "The inability to stand up",
      incorrect_answers: [
        "The inability to make decisions",
        "The inability to concentrate on anything",
        "A feverish desire to rip one&#039;s clothes off",
      ],
    },
    {
      category: "General Knowledge",
      type: "boolean",
      difficulty: "medium",
      question:
        "Instant mashed potatoes were invented by Canadian Edward Asselbergs in 1962.",
      correct_answer: "True",
      incorrect_answers: ["False"],
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question:
        "What are the three starter Pokemon available in Pokemon Black and White?",
      correct_answer: "Snivy, Tepig, Oshawott",
      incorrect_answers: [
        "Snivy, Fennekin, Froakie",
        "Chespin, Tepig, Froakie",
        "Chespin, Fennekin, Oshawott",
      ],
    },
    */
  ]);

  /* useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        if (confirm("Are you sure")) {
          navigation.dispatch(e.data.action);
        }
      }),
    [navigation, ]
  );*/

  useEffect(() => {
    init();
    return () => {};
  }, []);

  useEffect(() => {
    setValue(questions[questionIndex]?.userAnswer);
  }, [questions, questionIndex]);

  const init = async () => {
    setLoading(true);
    try {
      // throw new Error("");
      const data = await (
        await fetch(
          `https://opentdb.com/api.php?amount=10&category=${route.params.category}`
        )
      ).json();

      const arrange = data.results.map((question) => {
        let answers = shuffle([
          ...question.incorrect_answers,
          question.correct_answer,
        ]);
        return {
          ...question,
          answers,
          userAnswer: -1,
        };
      });

      // console.log(arrange);
      setQuestions(arrange);
    } catch (error) {
      // console.log(error);
      alert("There was an issue getting the questions");
    } finally {
      setLoading(false);
    }
  };

  const setAnswer = (questionIndex, answer) => {
    questions[questionIndex].userAnswer = answer;
    setQuestions(questions);
    setValue(questions[questionIndex]?.userAnswer);
  };

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const done = () => {
    Alert.alert("Are you sure you want to submit", "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          let score = 0;
          questions.forEach((question) => {
            if (question.userAnswer == question.correct_answer) {
              score++;
            }
          });

          Alert.alert(`You scored ${score}/${questions.length}`);
          navigation.navigate("Home");
        },
      },
    ]);
    /*if (confirm("Are you sure you want to submit")) {
      let score = 0;
      questions.forEach((question) => {
        if (question.userAnswer == question.correct_answer) {
          score++;
        }
      });

      alert(`You scored ${score}/${questions.length}`);
      navigation.navigate("Home");
    }*/
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : isEmpty(questions) ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Paragraph>Unable to get Questions.</Paragraph>
          <Button
            style={{ margin: 16 }}
            onPress={() => init()}
            icon={`reload`}
            mode="outlined"
          >
            Retry
          </Button>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={{}}>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <Button
                    onPress={openMenu}
                    style={{
                      marginTop: 24,
                      marginBottom: 24,
                      fontWeight: "600",
                    }}
                  >
                    {`Question ${questionIndex + 1}/${questions.length}`}
                  </Button>
                }
              >
                {questions.map((question, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      setQuestionIndex(index);
                      setVisible(false);
                    }}
                    title={`Question ${index + 1}`}
                  />
                ))}
              </Menu>

              <Paragraph style={{ fontSize: 20, lineHeight: 24, margin: 16 }}>
                {decode(questions[questionIndex].question)}
              </Paragraph>
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              <RadioButton.Group
                onValueChange={(newValue) => setAnswer(questionIndex, newValue)}
                value={value}
              >
                {questions[questionIndex].answers.map((answer, index) => (
                  <RadioButton.Item
                    key={`${questionIndex}-${index}`}
                    label={answer}
                    value={answer}
                    style={{
                      borderWidth: 0.5,
                      fontWeight: "500",
                      borderRadius: 8,
                      marginVertical: 8,
                      borderColor:
                        value && value === answer
                          ? theme.colors.accent
                          : "#20232a",
                    }}
                  />
                ))}
              </RadioButton.Group>
            </View>
          </View>

          <View
            style={{
              marginTop: 32,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Button
                onPress={() => setQuestionIndex(questionIndex - 1)}
                disabled={questionIndex === 0}
                contentStyle={{ padding: 16 }}
                style={{ margin: 12, flexGrow: 1, flexBasis: 0 }}
                mode={"outlined"}
                icon={"chevron-left"}
              >
                Prev
              </Button>
              <Button
                onPress={() => setQuestionIndex(questionIndex + 1)}
                disabled={questionIndex === questions.length - 1}
                contentStyle={{ padding: 16, flexDirection: "row-reverse" }}
                style={{ margin: 12, flexGrow: 1, flexBasis: 0 }}
                mode={"outlined"}
                icon={"chevron-right"}
              >
                Next
              </Button>
            </View>
            <Button
              mode="contained"
              onPress={() => done()}
              style={{ margin: 12, padding: 16 }}
            >
              Submit
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: "Quiz" }}
            />
            <Stack.Screen
              name="Questions"
              component={Questions}
              options={{ title: "Questions" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: Dimensions.get("window").height,
    // width: Dimensions.get("window").width,
    // backgroundColor: "#fff",
  },
  main: {
    padding: 24,
  },
  categoryButton: {
    padding: 16,
  },
});
