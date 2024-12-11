import { Module } from '@nestjs/common';
import { BaseSettingsModule } from './basesettings/base-settings.module';

@Module({
  imports: [BaseSettingsModule],
})
export class SettingsModule {}
