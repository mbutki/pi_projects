def main():
    data = 'a(b(c){2}){2}'
    start = 0
    end = len(data) - 1
    print(f'result: {process(data, start, end)}')

def process(data: str, start_i: int, end_i: int) -> str:
    i = start_i
    output = []

    while i <= end_i:
        # we see inner expression
        if data[i] == '(':
            # Get the inner text
            prens_start = i
            inner_start = i + 1 # char after (

            prens_end = data.rfind(')', start_i, end_i)
            inner_end = prens_end - 1 # char before )
            
            inner = process(data, inner_start, inner_end)

            # Apply repetition
            currly_start = prens_end + 1
            rep_start = currly_start + 1 # char after {

            currly_end = data.find('}', rep_start)
            rep_end = currly_end - 1 # char before }

            rep_num = int(data[rep_start:rep_end+1])

            output.append(inner * rep_num)
            i = currly_end + 1
        # we see normal char
        else:
            output.append(data[i])
            i += 1
    return ''.join(output)

if __name__ == '__main__':
    main()
