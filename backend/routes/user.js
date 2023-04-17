const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const client = new PrismaClient(); //새로운 생성자를 만든후에 client로 명명.

//유저생성
router.post("/", async (req, res) => {
  try {
    const { account } = req.body; // body의 경우

    const existUser = await client.user.findUnique({
      //await를 붙이지 않으면 pendding이 일어난다.
      where: {
        account,
      },
    }); //존재하고 있는 유저가 있는지 확인해보고, 존재하는 유저가 있다면 아래 코드를 진행.
    if (existUser) {
      return res
        .status(400)
        .json({ ok: false, error: "Already exist account." });
    }

    const user = await client.user.create({
      // 코드가 순차적으로 진행되기 떄문에 비동기함수로 처리.
      data: {
        account,
      },
    });

    res.json({ ok: true, user });
  } catch (error) {
    console.error(error);
  }
});

//유저조회
router.get("/:account", async (req, res) => {
  try {
    const { account } = req.params; // get요청에서 params자리에 body를 사용할 수 없다.

    const user = await client.user.findUnique({
      //Unique를 사용하는 이유는 account가 유니크한 값을 가지고 있기 때문에.
      where: {
        account,
      },
    });

    // 존재하지 않는 유저를 가져오려할때 해당 메세지를 노출하도록 함.
    if (!user) {
      return res.status(400).json({
        ok: false,
        error: "Not exist user.",
      });
    }

    res.json({
      ok: true, //필수값은 아니고 상태를 구별하기 위해서 넣은것.
      user,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
