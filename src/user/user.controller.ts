import { BadRequestException, Controller, Get, Param, ParseEnumPipe, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ROLE } from "@prisma/client";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get("get-profile/:id/:role")
  async getUserProfile(@Param("id", ParseIntPipe) id: number, @Param("role", new ParseEnumPipe(ROLE)) role: ROLE) {
    try {
      return await this.userService.getUserProfile({ id, role });
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}