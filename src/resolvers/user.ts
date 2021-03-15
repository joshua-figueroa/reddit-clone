import { Resolver, Ctx, Arg, Mutation } from "type-graphql";
import argon2, { argon2id } from "argon2";
import { MyContext } from "src/types";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async register(
    @Arg("username") username: string,
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password, {
      type: argon2id,
      hashLength: 50,
      timeCost: 5,
    });
    const user = em.create(User, {
      username,
      name,
      email,
      password: hashedPassword,
    });

    await em.persistAndFlush(user);
    return user;
  }
}
