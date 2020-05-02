import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: Request): Transaction {
    const transactions = this.transactionsRepository.all();
    const { total } = this.transactionsRepository.getBalance();

    if (!transactions.length && type === 'outcome') {
      throw Error('Transaction without balance is not possible');
    }

    if (value > total && type === 'outcome') {
      throw Error('Withdrawal amount greater than the balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
