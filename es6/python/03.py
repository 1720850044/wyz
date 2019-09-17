# age = input();
# if age >= 18:
#     print('adult');
# else :
#     print('2222');

# arr = [1,2,3,4];
# print(arr[0])

# a = 'ABC'
# b = a
# a = 'XYZ'
# print(b)

# arr = [1,2,3,4,5]
# print(arr[-1])

# -*- coding: utf-8 -*-
# def total(x):
#     return 2*x
# print(total(5))

# L = ['Michael', 'Sarah', 'Tracy']
# M = L[-2:-1]
# print(M)

l = [x * x for x in range(1, 11)]
print(l)

m = [x * x for x in range(1, 11) if x % 2 == 0]
print(m)

n = [m + n for m in 'ABC' for n in 'XYZ']
print(n)