import { beforeEach, describe, it, expect } from "vitest";

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Snowman from "./Snowman";

const MAX_WRONG = 4;

let renderedGame;

// helper function to assist with clicking on letters
function clickLetter(letter) {
  return fireEvent.click(renderedGame.getByText(letter));
}


beforeEach(function () {
  renderedGame = render(<Snowman maxWrong={MAX_WRONG} words={["apple"]} />);
});


describe("basic rendering", function () {
  it("renders successfully", function () {
    render(<Snowman />);
  });

  it("matches snapshot on initial render", function () {
    expect(renderedGame.container).toMatchSnapshot();
  });
});


describe("handle guessing", function () {
  it("changes the image on an incorrect guess", function () {
    expect(renderedGame.getByAltText("4 guesses left"))
        .toHaveAttribute("src", "/src/0.png");
    expect(renderedGame.queryByAltText("3 guesses left"))
        .not.toBeInTheDocument();

    clickLetter("b");

    expect(renderedGame.getByAltText("3 guesses left"))
        .toHaveAttribute("src", "/src/1.png");
    expect(renderedGame.queryByAltText("4 guesses left"))
        .not.toBeInTheDocument();
  });


  it("does not change the image on a correct guess", function () {
    expect(renderedGame.getByAltText("4 guesses left"))
        .toHaveAttribute("src", "/src/0.png");
    expect(renderedGame.queryByAltText("3 guesses left"))
        .not.toBeInTheDocument();

    clickLetter("a");

    expect(renderedGame.getByAltText("4 guesses left"))
        .toHaveAttribute("src", "/src/0.png");
    expect(renderedGame.queryByAltText("3 guesses left"))
        .not.toBeInTheDocument();
  });

  it("handles correct guesses", function () {
    expect(renderedGame.getByText("_____")).toBeInTheDocument();

    clickLetter("a");

    expect(renderedGame.getByText("a____")).toBeInTheDocument();

    clickLetter("p");

    expect(renderedGame.getByText("app__")).toBeInTheDocument();
    expect(renderedGame.getByText("Wrong: 0")).toBeInTheDocument();
  });

  it("handles incorrect guesses", function () {
    clickLetter("z");

    expect(renderedGame.getByText("_____")).toBeInTheDocument();
    expect(renderedGame.getByText("Wrong: 1")).toBeInTheDocument();
  });
});


describe("end game", function () {
  it("matches snapshot after losing", function () {
    clickLetter("b");
    clickLetter("z");
    clickLetter("r");
    clickLetter("q");

    expect(renderedGame.container).toMatchSnapshot();
  });

  it("matches snapshot after winning", function () {
    clickLetter("a");
    clickLetter("p");
    clickLetter("l");
    clickLetter("e");

    expect(renderedGame.container).toMatchSnapshot();
  });

  it("verifies 'You lose' is on the screen after losing", function () {
    clickLetter("b");
    clickLetter("z");
    clickLetter("r");
    clickLetter("q");

    expect(renderedGame.getByText("You lose: apple")).toBeInTheDocument();
  });

  it("verifies 'You won!' is on the screen after losing", function () {
    clickLetter("a");
    clickLetter("p");
    clickLetter("l");
    clickLetter("e");

    expect(renderedGame.getByText("You won!")).toBeInTheDocument();
  });

  it("restarts successfully", function () {
    clickLetter("a");
    clickLetter("z");
    clickLetter("q");
    clickLetter("r");
    clickLetter("m");

    expect(renderedGame.getByText("a____")).toBeInTheDocument();
    expect(renderedGame.getByText("Wrong: 4")).toBeInTheDocument();

    const restart = renderedGame.getByText("Restart");
    fireEvent.click(restart);

    expect(renderedGame.getByText("Wrong: 0")).toBeInTheDocument();
  });
});
