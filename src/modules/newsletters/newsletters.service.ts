import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { newsletters } from 'src/database/schema/newsletters.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class NewslettersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async subscribe(subscribeDto: SubscribeDto) {
    const { email } = subscribeDto;

    const existingSubscriber = await this.db.query.newsletters.findFirst({
      where: eq(newsletters.email, email),
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        throw new ConflictException('Email already subscribed');
      } else {
        await this.db
          .update(newsletters)
          .set({ isActive: true, unsubscribedAt: null })
          .where(eq(newsletters.id, existingSubscriber.id));
        return { message: 'Subscription reactivated successfully' };
      }
    }

    await this.db.insert(newsletters).values({ email });
    return { message: 'Subscribed successfully' };
  }

  async unsubscribe(email: string) {
    const subscriber = await this.db.query.newsletters.findFirst({
      where: eq(newsletters.email, email),
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    await this.db
      .update(newsletters)
      .set({ isActive: false, unsubscribedAt: new Date() })
      .where(eq(newsletters.id, subscriber.id));

    return { message: 'Unsubscribed successfully' };
  }

  async getAllSubscribers() {
    return this.db.query.newsletters.findMany({
      where: eq(newsletters.isActive, true),
    });
  }
}
