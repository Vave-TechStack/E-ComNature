'use client';

import { motion } from 'framer-motion';

interface SpecItem {
  key: string;
  value: string;
}

interface ProductSpecsProps {
  specifications: SpecItem[];
}

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">No specifications available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white overflow-hidden"
    >
      <table className="w-full text-sm">
        <tbody>
          {specifications.map((spec, index) => (
            <motion.tr
              key={spec.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="px-4 py-3 font-medium text-gray-700 w-1/3">{spec.key}</td>
              <td className="px-4 py-3 text-gray-600">{spec.value}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
