import prisma from './src/config/prisma.js'

async function test() {
    const user = await prisma.user.create({
        data: {
            name: "Tamil",
            email: "tamil@test.com",
            password: "1234"
        }
    })

    console.log(user)
}

test()