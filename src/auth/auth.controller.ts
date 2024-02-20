import { Controller } from "@nestjs/common";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController {
  async signin(data: AuthDto) {}
}