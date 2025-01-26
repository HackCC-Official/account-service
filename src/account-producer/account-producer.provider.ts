import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper, Channel } from 'amqp-connection-manager';
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { ResponseAccountDTO } from "src/account/response-account.dto";

@Injectable()
export class AccountProducerService {
  private channelWrapper: ChannelWrapper;

  @InjectPinoLogger(AccountProducerService.name)
  private readonly logger: PinoLogger;

  constructor(private configService: ConfigService) {
    const connection = amqp.connect(configService.get<string>('RABBITMQ_URL'));
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertExchange(
          configService.get<string>('ACCOUNT_EXCHANGE'),
          'topic', 
          {
            durable: true 
          }
        )
      }
    });
  } 

  async addCreatedAccountToAccountQueue(responseAccountDTO: ResponseAccountDTO) {
    try {
      await this.channelWrapper.publish(
        this.configService.get<string>('ACCOUNT_EXCHANGE'),
        'account.create',
        Buffer.from(JSON.stringify(responseAccountDTO)),
        {
          persistent: true
        }
      )
      this.logger.info("Sending account to queue", responseAccountDTO);
    } catch (error) {
      this.logger.info("Acccout queue error", error);
      throw new HttpException(
        'Error adding account to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}