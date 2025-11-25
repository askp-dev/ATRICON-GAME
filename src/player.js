class Player {
  constructor(playername) {
    this.name = playername;
    this.score = 0;
  }

  increaseScore(points) {
    this.score += points;
  }

  getScore() {
    return this.score;
  }
}

class Question {
  constructor(text, answers) {
    this.text = text;
    this.answers = answers;
    this.scores = [];
  }

  increaseScore(answerIndex, points) {
    this.scores[answerIndex] = (this.scores[answerIndex] || 0) + points;
  }

  isCorrectAnswer(givenAnswerIndex) {
    // check that the givenAnswer matches the answer with the highest scores
    const maxScore = Math.max(...this.scores);
    const highestScoringAnswer = this.answers[this.scores.indexOf(maxScore)];
    return highestScoringAnswer === this.answers[givenAnswerIndex];
  }

  getCorrectAnswer() {
    const maxScore = Math.max(...this.scores);
    return this.answers[this.scores.indexOf(maxScore)];
  }

  getAnswers() {
    return this.answers;
  }

  getScores() {
    return this.scores;
  }
}

class Category {
  constructor(name) {
    this.name = name;
    this.questions = [];
  }

  addQuestion(question) {
    this.questions.push(question);
  }
}

module.exports = { Player, Question, Category };
