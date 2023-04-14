const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const client = new PrismaClient(); //새로운 생성자를 만든후에 client로 명명.

//유저생성
router.post("/", async (req, res) => {
  try {
    const { account } = req.body;

    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });
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
    const { account } = req.params;

    const user = await client.user.findUnique({
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
