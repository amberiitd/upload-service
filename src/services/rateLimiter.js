let tokenBuckets = {};

const MAX_TOKENS = 2;

const limiter = (req, res, next) => {
  // console.info(req.headers);
	const userId = req.headers.userid;
  console.log("userId: ", userId)

	if (!tokenBuckets[userId]) {
		tokenBuckets[userId] = { count: MAX_TOKENS, lastRefilled: new Date().getTime() };
	}

	if (tokenBuckets[userId].count == 0) {
		const currentTimestamp = new Date().getTime();
		if (currentTimestamp - tokenBuckets[userId].lastRefilled > 60 * 1000) {
			tokenBuckets[userId] = { count: MAX_TOKENS, lastRefilled: currentTimestamp };
		} else {
			res.status(429).send("No more tokens");
      return;
		}
	}

	tokenBuckets[userId].count -= 1;
	next();
};

// batch jobs which is respnsible for refilling the bucket

module.exports = { limiter };
