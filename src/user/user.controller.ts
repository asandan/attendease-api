import { BadRequestException, Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { ROLE } from "@prisma/client";
import { UpdateUserProfileDto } from "./dto";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get("/get-profile/:id/:role")
  async getUserProfile(@Param("id", ParseIntPipe) id: number, @Param("role", new ParseEnumPipe(ROLE)) role: ROLE) {
    try {
      return await this.userService.getUserProfile({ id, role });
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  @Get("/get-users/:role")
  async getUsersByRole(@Param("role", new ParseEnumPipe(ROLE)) role: ROLE) {
    try {
      return await this.userService.getUsersByRole(role);
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  @Put("/update-profile")
  async updateProfile(@Body() data: UpdateUserProfileDto) {
    try {
      return await this.userService.updateProfile(data);
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}