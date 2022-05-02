import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from 'src/create-user/create-user-dto';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'Equipe CD <cd@codedrops.com>',
      subject: 'Seja bem vindo!',
      text: `Olá ${data.name}! Seu cadastro foi realizado com sucesso! Seja bem vindo!`,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`${job.name} completed!`);
  }

  @OnQueueProgress()
  onProgress(job: Job) {
    console.log(`${job.name} in progress!`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`${job.name} activated!`);
  }
}

export { SendMailConsumer };
