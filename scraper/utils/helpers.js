function randomDelay(min = 1000, max = 3000) {
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
}

function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function retryOperation(operation, maxRetries = 3, delay = 5000) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await operation();
        resolve(result);
        return;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed:`, error.message);
        if (i === maxRetries - 1) {
          reject(error);
        } else {
          await randomDelay(delay, delay * 2);
        }
      }
    }
  });
}

export { randomDelay, logWithTimestamp, retryOperation };