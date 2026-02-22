import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

/**
 * Modal Component - Modal moderno e acessível com Headless UI
 * 
 * @param {Object} props
 * @param {boolean} props.open - Estado do modal (aberto/fechado)
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {string} props.title - Título do modal
 * @param {string} props.description - Descrição do modal
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} props.size - Tamanho do modal
 * @param {boolean} props.closeButton - Mostrar botão de fechar
 * @param {React.ReactNode} props.children - Conteúdo do modal
 */
const Modal = ({
  open = false,
  onClose,
  title,
  description,
  size = 'md',
  closeButton = true,
  children,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1050]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all ${className}`}
              >
                {/* Header */}
                {(title || closeButton) && (
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    
                    {closeButton && (
                      <button
                        type="button"
                        className="ml-4 rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="mt-2">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeButton: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * ModalFooter - Rodapé do modal com botões
 */
export const ModalFooter = ({ children, className = '' }) => (
  <div className={`mt-6 flex items-center justify-end gap-3 ${className}`}>
    {children}
  </div>
);

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Modal;
