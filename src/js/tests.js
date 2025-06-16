function runTests() {
    testCollisionDetection();
  }
  
  function testCollisionDetection() {
    const tests = [
      {
        name: "Ball collides with block from top",
        ball: { x: 50, y: 45, radius: 5, dx: 0, dy: 5 },
        block: { x: 4, y: 5, status: true },
        expected: true
      },
      {
        name: "Ball collides with block from left",
        ball: { x: 35, y: 50, radius: 5, dx: 5, dy: 0 },
        block: { x: 4, y: 5, status: true },
        expected: true
      },
      {
        name: "Ball does not collide with block",
        ball: { x: 100, y: 100, radius: 5, dx: 0, dy: 0 },
        block: { x: 4, y: 5, status: true },
        expected: false
      },
      {
        name: "Ball near block but not colliding",
        ball: { x: 50, y: 60, radius: 5, dx: 0, dy: 0 },
        block: { x: 4, y: 5, status: true },
        expected: false
      }
    ];
  
    let passed = 0;
    const game = new Game(1);
  
    tests.forEach(test => {
      const result = game.checkBlockCollision(test.block, test.ball);
      if (result === test.expected) {
        passed++;
      } else {
        console.error(`Test failed: ${test.name}`);
      }
    });
  
    console.log(`Collision tests: ${passed}/${tests.length} passed`);
}
  
window.addEventListener('load', runTests);