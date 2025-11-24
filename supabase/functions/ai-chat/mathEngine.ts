type Operator = '+' | '-' | '*' | '/' | '%' | '^';

const OPERATORS: Record<Operator, { precedence: number; associativity: 'left' | 'right' }> = {
  '+': { precedence: 2, associativity: 'left' },
  '-': { precedence: 2, associativity: 'left' },
  '*': { precedence: 3, associativity: 'left' },
  '/': { precedence: 3, associativity: 'left' },
  '%': { precedence: 3, associativity: 'left' },
  '^': { precedence: 4, associativity: 'right' },
};

const ALLOWED_CHARS = /^[0-9+\-*/%^().\s]+$/;

function sanitizeExpression(rawExpression: string): string {
  if (typeof rawExpression !== 'string') return '';
  const trimmed = rawExpression.replace(/[^0-9+\-*/%^().\s]/g, '').trim();
  if (!trimmed || !ALLOWED_CHARS.test(trimmed)) {
    return '';
  }
  return trimmed.replace(/\s+/g, ' ');
}

function tokenize(expression: string): string[] | null {
  const tokens: string[] = [];
  let numberBuffer = '';
  let lastToken: string | null = null;

  for (let i = 0; i < expression.length; i += 1) {
    const char = expression[i];

    if (char === ' ') continue;

    if (/^[0-9.]$/.test(char)) {
      numberBuffer += char;
      lastToken = null;
      continue;
    }

    if (char === '-' && (lastToken === null || (lastToken in OPERATORS) || lastToken === '(')) {
      numberBuffer += char;
      continue;
    }

    if ((char in OPERATORS) || char === '(' || char === ')') {
      if (numberBuffer) {
        if (numberBuffer === '-' || numberBuffer === '.') return null;
        tokens.push(numberBuffer);
        numberBuffer = '';
      }
      tokens.push(char);
      lastToken = char;
      continue;
    }

    return null;
  }

  if (numberBuffer) {
    if (numberBuffer === '-' || numberBuffer === '.') return null;
    tokens.push(numberBuffer);
  }

  return tokens;
}

function toPostfix(tokens: string[]): string[] | null {
  if (!tokens || !tokens.length) return null;
  const output: string[] = [];
  const stack: string[] = [];

  for (const token of tokens) {
    if (!Number.isNaN(Number(token))) {
      output.push(token);
      continue;
    }

    if (token in OPERATORS) {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (
          (top in OPERATORS) &&
          ((OPERATORS[token as Operator].associativity === 'left' && OPERATORS[token as Operator].precedence <= OPERATORS[top as Operator].precedence) ||
            (OPERATORS[token as Operator].associativity === 'right' && OPERATORS[token as Operator].precedence < OPERATORS[top as Operator].precedence))
        ) {
          output.push(stack.pop()!);
        } else {
          break;
        }
      }
      stack.push(token);
      continue;
    }

    if (token === '(') {
      stack.push(token);
      continue;
    }

    if (token === ')') {
      let found = false;
      while (stack.length) {
        const op = stack.pop()!;
        if (op === '(') {
          found = true;
          break;
        }
        output.push(op);
      }
      if (!found) return null;
      continue;
    }

    return null;
  }

  while (stack.length) {
    const op = stack.pop()!;
    if (op === '(' || op === ')') return null;
    output.push(op);
  }

  return output;
}

function applyOperator(operator: string, a: number, b: number): number | null {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return null;
      return a / b;
    case '%':
      if (b === 0) return null;
      return a % b;
    case '^':
      return Math.pow(a, b);
    default:
      return null;
  }
}

function evaluatePostfix(postfix: string[], collectSteps = false) {
  if (!postfix) return null;
  const stack: number[] = [];
  const steps: any[] = [];

  for (const token of postfix) {
    if (!Number.isNaN(Number(token))) {
      stack.push(Number(token));
      continue;
    }

    const b = stack.pop();
    const a = stack.pop();
    if (typeof a !== 'number' || typeof b !== 'number') return null;

    const result = applyOperator(token, a, b);
    if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
      return null;
    }

    stack.push(result);

    if (collectSteps) {
      steps.push({
        expression: `${a} ${token} ${b}`,
        operation: token,
        result,
        description: `${a} ${token} ${b} = ${result}`,
      });
    }
  }

  if (stack.length !== 1) return null;
  return { result: stack[0], steps };
}

function formatNumber(value: number): string {
  try {
    return new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 6 }).format(value);
  } catch (_) {
    return String(value);
  }
}

export function calculateStepByStep(inputs: { expression: string } | string) {
  const expressionInput = typeof inputs === 'string' ? inputs : inputs?.expression ?? '';
  const sanitized = sanitizeExpression(expressionInput);
  if (!sanitized) return null;
  const tokens = tokenize(sanitized);
  if (!tokens) return null;
  const postfix = toPostfix(tokens);
  if (!postfix) return null;
  const evaluation = evaluatePostfix(postfix, true);
  if (!evaluation) return null;
  const { result, steps } = evaluation;
  return {
    expression: sanitized,
    result,
    formattedResult: formatNumber(result),
    steps,
  };
}
