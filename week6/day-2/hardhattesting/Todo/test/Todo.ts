import { expect } from "chai";
import { network } from "hardhat";

describe("Todo", function () {
  // Hardhat 3 helper
  const getEthers = async () => (await network.connect()).ethers;

  async function deployTodo() {
    const ethers = await getEthers();
    // Use the factory pattern or deployContract
    const todo = await ethers.deployContract("Todo");
    return { todo };
  }

  it("Should return an empty array initially", async function () {
    const { todo } = await deployTodo();
    const todos = await todo.getAllTodos();
    expect(todos.length).to.equal(0);
  });
});
