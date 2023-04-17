const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { route } = require("./user");

const router = express.Router();

const client = new PrismaClient();

// 투두 생성
router.post("/", async (req, res) => {
  try {
    const { todo, userId } = req.body;

    if (!todo) {
      //todo가 없으면 다음로직이 실행이 안되서 리턴.
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (!userId) {
      //userId가 없으면 다음로직이 실행이 안되서 리턴.
      return res.status(400).json({ ok: false, error: "Not exist userId." });
    }

    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    }); //유저가 없는 경우를 체크.

    if (!user) {
      return res.status(400).json({ ok: false, error: "Not exist user." });
    } // 아이디가 실제 존재하는 아이디인지 체크.

    const newTodo = await client.todo.create({
      data: {
        todo, // 투두,이즈던,유저아이디는 새로운 투두를 생성할때 필요한 정보이기에 들어감.
        isDone: false,
        userId: user.id, // 유저안에 아이디를 조회한다는 의미
      },
    });

    res.json({ ok: true, todo: newTodo });
  } catch (error) {
    console.error(error);
  }
});

// 투두 조회
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skip } = req.query;

    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      // 여기 작성된 user는 DB에서 조회한것. userId는 클라이언트에서.
      return res.status(400).json({ ok: false, error: "Not exist user." });
    }

    const todos = await client.todo.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        //생성된 시간 기준으로 투두를 가져오는 코드.
        createdAt: "desc",
      },
      skip: parseInt(skip), // 변화되는 값.
      take: 3, // 고정값.
    });

    res.json({ ok: true, todos });
  } catch (error) {
    console.error(error);
  }
});

// 투두 완료
router.put("/:id/done", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existTodo = await client.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existTodo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (existTodo.userId !== parseInt(userId)) {
      return res.status(400).json({ ok: false, error: "U R not todo owner." });
    }

    const updatedTodo = await client.todo.update({
      where: {
        // 조회할 데이터
        id: parseInt(id),
      },
      data: {
        // 업데이트 할 데이터
        isDone: !existTodo.isDone,
      },
    });

    res.json({ ok: true, todo: updatedTodo });
  } catch (error) {
    console.error(error);
  }
});

// 투두 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existTodo = await client.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existTodo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (existTodo.userId !== parseInt(userId)) {
      return res.status(400).json({ ok: false, error: "U R not todo owner." });
    }

    const deletedTodo = await client.todo.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ ok: true, todo: deletedTodo });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
