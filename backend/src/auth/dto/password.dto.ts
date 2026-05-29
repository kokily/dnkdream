import { ApiProperty } from "@nestjs/swagger";

export class PasswordDto {
  @ApiProperty({
    example: 'my-secret-password',
    description: '관리자 비밀번호',
  })
  password!: string;
}