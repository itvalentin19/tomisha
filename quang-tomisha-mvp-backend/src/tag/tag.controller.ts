import { Controller, Get, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { FindTagsDto } from './dto';
import { TagService } from './tag.service';

@SkipThrottle(true)
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  public getTags(@Query() findTagsDto: FindTagsDto) {
    return this.tagService.find(findTagsDto);
  }
}
